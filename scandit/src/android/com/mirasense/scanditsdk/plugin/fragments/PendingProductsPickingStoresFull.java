package com.mirasense.scanditsdk.plugin.fragments;

import android.app.Activity;
import android.content.Context;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import com.galvintec.prestaappkrack.tiendas.R;
import com.mirasense.scanditsdk.plugin.adapters.PickingStoresAdapter;

import org.json.JSONObject;

import java.util.ArrayList;

/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link PendingProductsPickingStoresFull.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link PendingProductsPickingStoresFull#newInstance} factory method to
 * create an instance of this fragment.
 */
public class PendingProductsPickingStoresFull extends Fragment {
  // TODO: Rename parameter arguments, choose names that match
  // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
  private static final String ARG_PARAM1 = "param1";
  private static final String ARG_PARAM2 = "param2";

  // TODO: Rename and change types of parameters
  private String mParam1;
  private String mParam2;

  private static View mainView = null;

  private OnFragmentInteractionListener mListener;

  public PendingProductsPickingStoresFull() {
    // Required empty public constructor
  }

  /**
   * Use this factory method to create a new instance of
   * this fragment using the provided parameters.
   *
   * @param param1 Parameter 1.
   * @param param2 Parameter 2.
   * @return A new instance of fragment PendingProductsPickingStoresFull.
   */
  // TODO: Rename and change types and number of parameters
  public static PendingProductsPickingStoresFull newInstance(String param1, String param2) {
    PendingProductsPickingStoresFull fragment = new PendingProductsPickingStoresFull();
    Bundle args = new Bundle();
    args.putString(ARG_PARAM1, param1);
    args.putString(ARG_PARAM2, param2);
    fragment.setArguments(args);
    return fragment;
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    if (getArguments() != null) {
      mParam1 = getArguments().getString(ARG_PARAM1);
      mParam2 = getArguments().getString(ARG_PARAM2);
    }
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container,
                           Bundle savedInstanceState) {
    // Inflate the layout for this fragment
    mainView = inflater.inflate(R.layout.fragment_pending_products_picking_stores_full, container, false);

    return mainView;
  }

  public void updateListView(Activity activity, Resources resources, String package_name, ArrayList<JSONObject> productsPending) {
    PickingStoresAdapter processedProductsAdapter = new PickingStoresAdapter(activity, productsPending, resources, package_name);
    ListView lvPendingPickingProducts = mainView.findViewById(resources.getIdentifier("lvPendingPickingProductsFull", "id", package_name));
    lvPendingPickingProducts.setAdapter(processedProductsAdapter);
  }

  // TODO: Rename method, update argument and hook method into UI event
  public void onButtonPressed(Uri uri) {
    if (mListener != null) {
      mListener.onFragmentInteraction(uri);
    }
  }

  @Override
  public void onAttach(Context context) {
    super.onAttach(context);
    if (context instanceof OnFragmentInteractionListener) {
      mListener = (OnFragmentInteractionListener) context;
    } else {
      throw new RuntimeException(context.toString()
        + " must implement OnFragmentInteractionListener");
    }
  }

  @Override
  public void onDetach() {
    super.onDetach();
    mListener = null;
  }

  /**
   * This interface must be implemented by activities that contain this
   * fragment to allow an interaction in this fragment to be communicated
   * to the activity and potentially other fragments contained in that
   * activity.
   * <p>
   * See the Android Training lesson <a href=
   * "http://developer.android.com/training/basics/fragments/communicating.html"
   * >Communicating with Other Fragments</a> for more information.
   */
  public interface OnFragmentInteractionListener {
    // TODO: Update argument type and name
    void onFragmentInteraction(Uri uri);
  }
}